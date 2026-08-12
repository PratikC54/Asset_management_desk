package com.niyati.template.service;

import com.niyati.template.dto.ApiDtos;
import com.niyati.template.exception.AssetNotFoundException;
import com.niyati.template.models.*;
import com.niyati.template.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AssetIssueService {

    private final AssetIssueRepository assetIssueRepository;
    private final AssetRepository assetRepository;
    private final UserRepository userRepository;
    private final AssetReturnRepository assetReturnRepository;
    private final AssetRequestRepository assetRequestRepository;



    public ApiDtos.IssueResponse AssetIssue(ApiDtos.CreateIssueRequest request) {
        if (request.getAssetRequestId() == null) {
            throw new IllegalArgumentException("An approved asset request is required before issuing an asset.");
        }
        AssetRequest assetRequest = assetRequestRepository.findById(request.getAssetRequestId())
                .orElseThrow(() -> new AssetNotFoundException("Asset request not found."));
        if (assetRequest.getType() != RequestType.NEW_REQUEST || assetRequest.getStatus() != RequestStatus.APPROVED
                || assetRequest.getRelatedIssue() != null) {
            throw new IllegalArgumentException("This asset request is not available to issue.");
        }
        if (!assetRequest.getRequester().getUserId().equals(request.getEmployeeId())) {
            throw new IllegalArgumentException("The selected employee does not match the approved request.");
        }
        var asset = assetRepository.findById(request.getAssetId()).orElseThrow();
        if (asset.getStatus() != AssetStatus.AVAILABLE) {
            throw new IllegalArgumentException("Only available assets can be issued.");
        }

        AssetIssue issueRequest = AssetIssue.builder()
                                .asset(asset)
                                .employee(userRepository.findById(request.getEmployeeId()).orElseThrow())
                                .issuedBy(userRepository.findByRole(USER_ROLE.ASSET_ISSUER))
                                .issueDate(LocalDate.now())
                                .remarks(request.getRemarks())
                                .expectedReturnDate(request.getExpectedReturnDate())
                                .build();
        asset.setStatus(AssetStatus.ISSUED);
        assetRepository.save(asset);
        assetIssueRepository.save(issueRequest);
        assetRequest.setRelatedIssue(issueRequest);
        assetRequestRepository.save(assetRequest);
        return ApiDtos.IssueResponse.from(issueRequest);
    }

    public ApiDtos.ReturnResponse returnAssetRequest(ApiDtos.CreateReturnRequest request) {
        if (request.getReturnRequestId() == null) {
            throw new IllegalArgumentException("A pending return request is required.");
        }
        AssetRequest returnAssetRequest = assetRequestRepository.findById(request.getReturnRequestId())
                .orElseThrow(() -> new AssetNotFoundException("Return request not found."));
        if (returnAssetRequest.getType() != RequestType.RETURN_REQUEST || returnAssetRequest.getStatus() != RequestStatus.PENDING
                || returnAssetRequest.getRelatedIssue() == null) {
            throw new IllegalArgumentException("This return request is not awaiting approval.");
        }
        var issue = returnAssetRequest.getRelatedIssue();
        if (request.getIssueId() != null && !issue.getId().equals(request.getIssueId())) {
            throw new IllegalArgumentException("The selected issue does not match the return request.");
        }
        if (issue.getStatus() == IssueStatus.RETURNED) {
            throw new IllegalArgumentException("This asset issue has already been returned.");
        }

        AssetReturn assetReturn = AssetReturn.builder()
                .issue(issue)
                .returnDate(LocalDate.now())
                .receivedBy(userRepository.findByRole(USER_ROLE.ASSET_ISSUER))
                .returnedCondition(request.getReturnedCondition())
                .remarks(request.getRemarks())
                .build();
        issue.setStatus(IssueStatus.RETURNED);
        assetIssueRepository.save(issue);

        var asset = issue.getAsset();
        asset.setAssetCondition(request.getReturnedCondition());
        asset.setStatus(request.getReturnedCondition() == AssetCondition.GOOD
                ? AssetStatus.AVAILABLE
                : AssetStatus.MAINTENANCE);
        assetRepository.save(asset);
        assetReturnRepository.save(assetReturn);
        returnAssetRequest.setStatus(RequestStatus.APPROVED);
        assetRequestRepository.save(returnAssetRequest);
        return ApiDtos.ReturnResponse.from(assetReturn);
    }

    public ApiDtos.AssetRequestResponse assetRequest(ApiDtos.CreateAssetRequestPayload requestPayload) {
        if (requestPayload.getAssetName() == null || requestPayload.getAssetName().isBlank()) {
            throw new IllegalArgumentException("Asset name is required.");
        }

        AssetIssue relatedIssue = requestPayload.getIssueId() == null
                ? null
                : assetIssueRepository.findById(requestPayload.getIssueId()).orElseThrow();
        User requester = userRepository.findByEmail(requestPayload.getEmail()).orElseThrow();
        RequestType type = requestPayload.getType() != null ? requestPayload.getType() : RequestType.NEW_REQUEST;
        if (type == RequestType.RETURN_REQUEST) {
            if (relatedIssue == null) {
                throw new IllegalArgumentException("An issued asset must be selected for a return request.");
            }
            if (!relatedIssue.getEmployee().getUserId().equals(requester.getUserId())) {
                throw new IllegalArgumentException("Employees can only return assets issued to them.");
            }
            if (relatedIssue.getStatus() != IssueStatus.ISSUED) {
                throw new IllegalArgumentException("This asset is no longer eligible for return.");
            }
            if (assetRequestRepository.existsByRelatedIssueAndTypeAndStatus(
                    relatedIssue, RequestType.RETURN_REQUEST, RequestStatus.PENDING)) {
                throw new IllegalArgumentException("A return request for this asset is already awaiting asset issuer approval.");
            }
        }
        AssetRequest assetRequest = AssetRequest.builder()
                .asset(type == RequestType.RETURN_REQUEST ? relatedIssue.getAsset() : assetRepository.findByAssetName(requestPayload.getAssetName()))
                .requester(requester)
                .assetName(type == RequestType.RETURN_REQUEST ? relatedIssue.getAsset().getAssetName() : requestPayload.getAssetName())
                .relatedIssue(relatedIssue)
                .type(type)
                .remarks(requestPayload.getRemarks())
                .build();
        assetRequestRepository.save(assetRequest);

        return ApiDtos.AssetRequestResponse.from(assetRequest);
    }


    public void managerApproval(Long id, RequestStatus status) {
        AssetRequest request = assetRequestRepository.findById(id).orElseThrow(() -> new AssetNotFoundException("No asset found"));
        if (request.getType() != RequestType.NEW_REQUEST) {
            throw new IllegalArgumentException("Return requests must be approved by the asset issuer.");
        }
        request.setStatus(status);

        assetRequestRepository.save(request);
    }
}

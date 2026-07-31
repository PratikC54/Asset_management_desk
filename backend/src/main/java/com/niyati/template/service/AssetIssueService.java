package com.niyati.template.service;

import com.niyati.template.dto.ApiDtos;
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
        return ApiDtos.IssueResponse.from(issueRequest);
    }

    public ApiDtos.ReturnResponse returnAssetRequest(ApiDtos.CreateReturnRequest request) {
        var issue = assetIssueRepository.findById(request.getIssueId()).orElseThrow();
        if (issue.getStatus() == IssueStatus.RETURNED) {
            throw new IllegalArgumentException("This asset issue has already been returned.");
        }

        AssetReturn returnRequest = AssetReturn.builder()
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
        assetReturnRepository.save(returnRequest);
        return ApiDtos.ReturnResponse.from(returnRequest);
    }

    public ApiDtos.AssetRequestResponse assetRequest(ApiDtos.CreateAssetRequestPayload requestPayload) {
        if (requestPayload.getAssetName() == null || requestPayload.getAssetName().isBlank()) {
            throw new IllegalArgumentException("Asset name is required.");
        }

        AssetIssue relatedIssue = requestPayload.getIssueId() == null
                ? null
                : assetIssueRepository.findById(requestPayload.getIssueId()).orElseThrow();
        AssetRequest assetRequest = AssetRequest.builder()
                .asset(assetRepository.findByAssetName(requestPayload.getAssetName()))
                .requester(userRepository.findByEmail(requestPayload.getEmail()).orElseThrow())
                .assetName(requestPayload.getAssetName())
                .relatedIssue(relatedIssue)
                .type(requestPayload.getType() != null ? requestPayload.getType() : RequestType.NEW_REQUEST)
                .remarks(requestPayload.getRemarks())
                .build();
        assetRequestRepository.save(assetRequest);

        return ApiDtos.AssetRequestResponse.from(assetRequest);
    }


    public void managerApproval(Long id, RequestStatus status) {
        AssetRequest request = assetRequestRepository.findById(id).orElseThrow();
        request.setStatus(status);

        assetRequestRepository.save(request);
    }
}

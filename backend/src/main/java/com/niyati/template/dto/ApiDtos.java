package com.niyati.template.dto;

import com.niyati.template.models.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class ApiDtos {

    @Data
    @Builder
    public static class AssetResponse {
        private Long id;
        private String assetCode;
        private String assetName;
        private String category;
        private String serialNumber;
        private AssetCondition condition;
        private AssetStatus status;

        public static AssetResponse from(Asset asset) {
            return AssetResponse.builder()
                    .id(asset.getId())
                    .assetCode(asset.getAssetCode())
                    .assetName(asset.getAssetName())
                    .category(asset.getCategory())
                    .serialNumber(asset.getSerialNumber())
                    .condition(asset.getAssetCondition())
                    .status(asset.getStatus())
                    .build();
        }
    }

    @Data
    public static class CreateAssetRequest {
        private String assetCode;
        private String assetName;
        private String category;
        private String serialNumber;
        private AssetCondition condition;
    }

    @Data
    public static class CreateAssetRequestPayload {
        private String assetName;
        private RequestType type;
        private Long issueId;
        private String remarks;
        private String email;
    }

    @Data
    @Builder
    public static class AssetRequestResponse {
        private Long id;
        private Long requesterId;
        private String requesterName;
        private String assetName;
        private Long assetId;
        private Long issueId;
        private RequestType type;
        private RequestStatus status;
        private String remarks;
        private LocalDateTime createdAt;

        public static AssetRequestResponse from(AssetRequest request) {
            return AssetRequestResponse.builder()
                    .id(request.getId())
                    .requesterId(request.getRequester().getUserId())
                    .requesterName(request.getRequester().getName())
                    .assetName(request.getAssetName())
                    .assetId(request.getAsset() != null ? request.getAsset().getId() : null)
                    .issueId(request.getRelatedIssue() != null ? request.getRelatedIssue().getId() : null)
                    .type(request.getType())
                    .status(request.getStatus())
                    .remarks(request.getRemarks())
                    .createdAt(request.getCreatedAt())
                    .build();
        }
    }

    @Data
    public static class CreateIssueRequest {
        private Long assetId;
        private Long employeeId;
        private Long assetRequestId;
        private LocalDate expectedReturnDate;
        private String remarks;
    }

    @Data
    @Builder
    public static class IssueResponse {
        private Long id;
        private Long assetId;
        private String assetCode;
        private String assetName;
        private Long employeeId;
        private String employeeName;
        private Long issuedById;
        private String issuedByName;
        private LocalDate issueDate;
        private LocalDate expectedReturnDate;
        private String remarks;
        private IssueStatus status;

        public static IssueResponse from(AssetIssue issue) {
            return IssueResponse.builder()
                    .id(issue.getId())
                    .assetId(issue.getAsset().getId())
                    .assetCode(issue.getAsset().getAssetCode())
                    .assetName(issue.getAsset().getAssetName())
                    .employeeId(issue.getEmployee().getUserId())
                    .employeeName(issue.getEmployee().getName())
                    .issuedById(issue.getIssuedBy().getUserId())
                    .issuedByName(issue.getIssuedBy().getName())
                    .issueDate(issue.getIssueDate())
                    .expectedReturnDate(issue.getExpectedReturnDate())
                    .remarks(issue.getRemarks())
                    .status(issue.getStatus())
                    .build();
        }
    }

    @Data
    public static class CreateReturnRequest {
        private Long returnRequestId;
        private Long issueId;
        private AssetCondition returnedCondition;
        private String remarks;
    }

    @Data
    @Builder
    public static class ReturnResponse {
        private Long id;
        private Long issueId;
        private String assetName;
        private String employeeName;
        private LocalDate returnDate;
        private AssetCondition returnedCondition;
        private String receivedByName;
        private String remarks;

        public static ReturnResponse from(AssetReturn assetReturn) {
            AssetIssue issue = assetReturn.getIssue();
            return ReturnResponse.builder()
                    .id(assetReturn.getId())
                    .issueId(issue.getId())
                    .assetName(issue.getAsset().getAssetName())
                    .employeeName(issue.getEmployee().getName())
                    .returnDate(assetReturn.getReturnDate())
                    .returnedCondition(assetReturn.getReturnedCondition())
                    .receivedByName(assetReturn.getReceivedBy().getName())
                    .remarks(assetReturn.getRemarks())
                    .build();
        }
    }

    @Data
    @Builder
    public static class DashboardSummary {
        private long totalAssets;
        private long availableAssets;
        private long issuedAssets;
        private long pendingRequests;
        private long approvedRequests;
        private long openIssues;
        private long returnsRecorded;
    }
}

package com.niyati.template.controller;

import com.niyati.template.dto.UserResponse;
import com.niyati.template.models.*;
import com.niyati.template.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final AssetRepository assetRepository;
    private final AssetIssueRepository assetIssueRepository;
    private final AssetRequestRepository assetRequestRepository;
    private final UserRepository userRepository;

    @GetMapping("/employee")
    public ResponseEntity<Map<String, Object>> employeeDashboard(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("User not found"));
        List<AssetIssue> issues = assetIssueRepository.findByEmployeeOrderByCreatedAtDesc(user);
        List<AssetRequest> requests = assetRequestRepository.findByRequesterOrderByCreatedAtDesc(user);

        Map<String, Object> payload = new HashMap<>();
        payload.put("user", UserResponse.from(user));
        payload.put("issues", issues.stream().map(this::toIssueSummary).collect(Collectors.toList()));
        payload.put("requests", requests.stream().map(this::toRequestSummary).collect(Collectors.toList()));
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/manager")
    public ResponseEntity<Map<String, Object>> managerDashboard() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("pendingRequests", assetRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.PENDING).stream()
                .filter(request -> request.getType() == RequestType.NEW_REQUEST)
                .map(this::toRequestSummary).collect(Collectors.toList()));
        payload.put("approvedCount", assetRequestRepository.countByStatus(RequestStatus.APPROVED));
        payload.put("inProgressCount", assetIssueRepository.countByStatus(IssueStatus.ISSUED));
        payload.put("pendingCount", assetRequestRepository.countByStatus(RequestStatus.PENDING));
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/stock-manager")
    public ResponseEntity<Map<String, Object>> stockManagerDashboard() {
        Map<String, Object> payload = new HashMap<>();
        List<Asset> assets = assetRepository.findAll();
        payload.put("assets", assets.stream().map(this::toAssetSummary).collect(Collectors.toList()));
        payload.put("totalAssets", assets.size());
        payload.put("availableAssets", assetRepository.countByStatus(AssetStatus.AVAILABLE));
        payload.put("lowStockAssets", assets.stream().filter(asset -> asset.getStatus() == AssetStatus.AVAILABLE && asset.getAssetCode().contains("AS") ? false : false).count());
        return ResponseEntity.ok(payload);
    }

    @GetMapping("/asset-issuer")
    public ResponseEntity<Map<String, Object>> assetIssuerDashboard() {
        Map<String, Object> payload = new HashMap<>();
        payload.put("approvedRequests", assetRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.APPROVED).stream()
                .filter(request -> request.getType() == RequestType.NEW_REQUEST && request.getRelatedIssue() == null)
                .map(this::toRequestSummary).collect(Collectors.toList()));
        payload.put("pendingReturnRequests", assetRequestRepository.findByStatusOrderByCreatedAtDesc(RequestStatus.PENDING).stream()
                .filter(request -> request.getType() == RequestType.RETURN_REQUEST)
                .map(this::toRequestSummary).collect(Collectors.toList()));
        payload.put("issuedAssets", assetIssueRepository.findByStatusOrderByCreatedAtDesc(IssueStatus.ISSUED).stream().map(this::toIssueSummary).collect(Collectors.toList()));
        payload.put("receivedAssets", assetIssueRepository.findByStatusOrderByCreatedAtDesc(IssueStatus.RETURNED).stream().map(this::toIssueSummary).collect(Collectors.toList()));
        payload.put("issuedToday", assetIssueRepository.findByStatusOrderByCreatedAtDesc(IssueStatus.ISSUED).size());
        payload.put("receivedToday", assetIssueRepository.findByStatusOrderByCreatedAtDesc(IssueStatus.RETURNED).size());
        return ResponseEntity.ok(payload);
    }

    private Map<String, Object> toIssueSummary(AssetIssue issue) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", issue.getId());
        summary.put("employee", issue.getEmployee().getName());
        summary.put("asset", issue.getAsset().getAssetName());
        summary.put("date", issue.getIssueDate().toString());
        summary.put("status", issue.getStatus().name());
        return summary;
    }

    private Map<String, Object> toRequestSummary(AssetRequest request) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", request.getId());
        summary.put("employee", request.getRequester().getName());
        summary.put("requesterId", request.getRequester().getUserId());
        summary.put("asset", request.getAssetName());
        summary.put("type", request.getType().name());
        summary.put("date", request.getCreatedAt().toLocalDate().toString());
        summary.put("status", request.getStatus().name());
        summary.put("issueId", request.getRelatedIssue() != null ? request.getRelatedIssue().getId() : null);
        return summary;
    }

    private Map<String, Object> toAssetSummary(Asset asset) {
        Map<String, Object> summary = new HashMap<>();
        summary.put("id", asset.getAssetCode());
        summary.put("name", asset.getAssetName());
        summary.put("category", asset.getCategory());
        summary.put("quantity", 1);
        summary.put("available", asset.getStatus() == AssetStatus.AVAILABLE ? 1 : 0);
        summary.put("status", asset.getStatus().name());
        return summary;
    }
}

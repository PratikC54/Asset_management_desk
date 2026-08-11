package com.niyati.template.controller;

import com.niyati.template.dto.ApiDtos;
import com.niyati.template.models.RequestStatus;
import com.niyati.template.service.AssetIssueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetIssueController {

    private final AssetIssueService assetIssueService;

    @PostMapping("/issue-request")
    public ResponseEntity<ApiDtos.IssueResponse> AssetIssue(@RequestBody ApiDtos.CreateIssueRequest request) {
        return ResponseEntity.ok(assetIssueService.AssetIssue(request));

    }

    @PostMapping("/return-request")
    public ResponseEntity<ApiDtos.ReturnResponse> returnAssetRequest(@RequestBody ApiDtos.CreateReturnRequest request) {
        return ResponseEntity.ok(assetIssueService.returnAssetRequest(request));
    }

    @PostMapping("/asset-request")
    public ResponseEntity<ApiDtos.AssetRequestResponse> assetRequest(@RequestBody ApiDtos.CreateAssetRequestPayload requestPayload,
                                                                       Authentication authentication) {
        requestPayload.setEmail(authentication.getName());
        return ResponseEntity.ok(assetIssueService.assetRequest(requestPayload));
    }

    @PatchMapping("/asset-request/{id}/status")
    public ResponseEntity<?> managerApproval(@PathVariable Long id, @RequestBody RequestStatus status) {
        assetIssueService.managerApproval(id, status);
        return ResponseEntity.ok().build();
    }

}

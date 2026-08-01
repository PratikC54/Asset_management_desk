package com.niyati.template.controller;

import com.niyati.template.dto.ApiDtos;
import com.niyati.template.models.AssetStatus;
import com.niyati.template.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/asset")
@RequiredArgsConstructor
public class Assetcontroller {

    private final AssetService assetService;

    @PostMapping("/create-asset")
    public ResponseEntity<?> createAsset(@RequestBody ApiDtos.CreateAssetRequest request) {
        return ResponseEntity.ok(assetService.createAsset(request));
    }

    @GetMapping("/status")
    public ResponseEntity<List<ApiDtos.AssetResponse>> getAvailableAsset(@RequestParam AssetStatus status) {
        return ResponseEntity.ok(assetService.getAvailableAsset(status));
    }
}

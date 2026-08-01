package com.niyati.template.service;

import com.niyati.template.dto.ApiDtos;
import com.niyati.template.dto.UserResponse;
import com.niyati.template.models.Asset;
import com.niyati.template.models.AssetStatus;
import com.niyati.template.models.USER_ROLE;
import com.niyati.template.models.User;
import com.niyati.template.repository.AssetRepository;
import com.niyati.template.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetService {

    private final AssetRepository assetRepository;

    public List<ApiDtos.AssetResponse> listAssets(AssetStatus status) {
        List<Asset> assets = status == null
                ? assetRepository.findAll()
                : assetRepository.findByStatus(status);
        return assets.stream().map(ApiDtos.AssetResponse::from).toList();
    }

    public ApiDtos.AssetResponse createAsset(ApiDtos.CreateAssetRequest request) {
        if (request.getAssetCode() == null || request.getAssetCode().isBlank()) {
            throw new IllegalArgumentException("Asset code is required.");
        }
        if (request.getAssetName() == null || request.getAssetName().isBlank()) {
            throw new IllegalArgumentException("Asset name is required.");
        }
        if (assetRepository.findByAssetCode(request.getAssetCode().trim()).isPresent()) {
            throw new IllegalArgumentException("Asset code already exists.");
        }

        Asset asset = Asset.builder()
                .assetCode(request.getAssetCode().trim())
                .assetName(request.getAssetName().trim())
                .category(request.getCategory())
                .serialNumber(request.getSerialNumber())
                .assetCondition(request.getCondition() != null ? request.getCondition() : com.niyati.template.models.AssetCondition.GOOD)
                .status(AssetStatus.AVAILABLE)
                .build();

        return ApiDtos.AssetResponse.from(assetRepository.save(asset));
    }

    public List<ApiDtos.AssetResponse> getAvailableAsset(AssetStatus status) {
        return assetRepository.findAllByStatus(status)
                .stream()
                .map(ApiDtos.AssetResponse::from)
                .toList();
    }
}
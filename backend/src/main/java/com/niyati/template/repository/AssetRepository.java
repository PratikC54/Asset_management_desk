package com.niyati.template.repository;

import com.niyati.template.dto.ApiDtos;
import com.niyati.template.models.Asset;
import com.niyati.template.models.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    Optional<Asset> findByAssetCode(String assetCode);

    List<Asset> findByStatus(AssetStatus status);

    long countByStatus(AssetStatus status);

    Asset findByAssetName(String assetName);

    List<Asset> findAllByStatus(AssetStatus status);
}

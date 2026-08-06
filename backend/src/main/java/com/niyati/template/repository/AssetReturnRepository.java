package com.niyati.template.repository;

import com.niyati.template.models.AssetReturn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetReturnRepository extends JpaRepository<AssetReturn, Long> {
    List<AssetReturn> findAllByOrderByCreatedAtDesc();
}

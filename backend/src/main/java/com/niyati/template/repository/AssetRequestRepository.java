package com.niyati.template.repository;

import com.niyati.template.models.AssetRequest;
import com.niyati.template.models.RequestStatus;
import com.niyati.template.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetRequestRepository extends JpaRepository<AssetRequest, Long> {
    List<AssetRequest> findByRequesterOrderByCreatedAtDesc(User requester);

    List<AssetRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

    long countByStatus(RequestStatus status);
}

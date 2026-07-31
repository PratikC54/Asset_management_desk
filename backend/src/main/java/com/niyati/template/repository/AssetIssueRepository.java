package com.niyati.template.repository;

import com.niyati.template.models.AssetIssue;
import com.niyati.template.models.IssueStatus;
import com.niyati.template.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AssetIssueRepository extends JpaRepository<AssetIssue, Long> {
    List<AssetIssue> findByEmployeeOrderByCreatedAtDesc(User employee);

    List<AssetIssue> findByStatusOrderByCreatedAtDesc(IssueStatus status);

    long countByStatus(IssueStatus status);
}

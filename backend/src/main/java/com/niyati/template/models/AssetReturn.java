package com.niyati.template.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_returns")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetReturn {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "issue_id")
    private AssetIssue issue;

    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    private AssetCondition returnedCondition;

    @ManyToOne(optional = false)
    @JoinColumn(name = "received_by_id")
    private User receivedBy;

    private String remarks;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

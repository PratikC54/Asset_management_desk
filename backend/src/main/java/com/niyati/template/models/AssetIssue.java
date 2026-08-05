package com.niyati.template.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "asset_issues")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssetIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "asset_id")
    private Asset asset;

    @ManyToOne(optional = false)
    @JoinColumn(name = "employee_id")
    private User employee;

    @ManyToOne(optional = false)
    @JoinColumn(name = "issued_by_id")
    private User issuedBy;

    private LocalDate issueDate;

    private LocalDate expectedReturnDate;

    private String remarks;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private IssueStatus status = IssueStatus.ISSUED;

    @CreationTimestamp
    private LocalDateTime createdAt;
}

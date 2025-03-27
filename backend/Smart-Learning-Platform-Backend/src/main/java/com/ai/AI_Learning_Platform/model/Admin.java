package com.ai.AI_Learning_Platform.model;

import jakarta.persistence.*;
import lombok.*;
import org.eclipse.angus.mail.imap.protocol.INTERNALDATE;

@Entity
@Setter
@Getter
@AllArgsConstructor
@ToString
@DiscriminatorValue("ADMIN")
@NoArgsConstructor
public class Admin  extends User{
    private Integer otp;
}

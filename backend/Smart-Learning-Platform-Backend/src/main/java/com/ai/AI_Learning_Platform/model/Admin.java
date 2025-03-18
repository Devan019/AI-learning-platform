package com.ai.AI_Learning_Platform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Entity
@Setter
@Getter
@AllArgsConstructor
@ToString
@DiscriminatorValue("ADMIN")
public class Admin  extends User{
    private String Authcode;
}

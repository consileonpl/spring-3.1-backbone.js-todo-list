package pl.consileon.model;

import javax.persistence.*;

@Entity
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String description;

    public Task() {
    }

    public String getDescription() {
        return description;
    }
}

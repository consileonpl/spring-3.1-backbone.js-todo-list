package pl.consileon.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.consileon.model.Task;

public interface TasksRepository extends JpaRepository<Task, Long> {
    Task findByDescription(String description);
}

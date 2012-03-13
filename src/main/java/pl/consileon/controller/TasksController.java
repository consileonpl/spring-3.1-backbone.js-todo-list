package pl.consileon.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import pl.consileon.model.Task;

import java.util.Arrays;
import java.util.List;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
@RequestMapping(value = "/tasks", produces = "application/json")
public class TasksController {
    @RequestMapping(method = GET)
    @ResponseBody
    public List<Task> list() {
        return Arrays.asList(new Task("Buy Milk"),
                new Task("Feed a dog"));
    }
}

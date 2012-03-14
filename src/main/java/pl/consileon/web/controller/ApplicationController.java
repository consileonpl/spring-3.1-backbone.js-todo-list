package pl.consileon.web.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import static org.springframework.web.bind.annotation.RequestMethod.GET;

@Controller
public class ApplicationController {
    @RequestMapping(value = "/", method = GET)
    public String index() {
        return "index.html";
    }
}

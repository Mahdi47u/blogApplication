package com.mahdi.blogApp.controller;


import com.mahdi.blogApp.model.CommentModel;
import com.mahdi.blogApp.model.PostModel;
import com.mahdi.blogApp.service.CommentService;
import com.mahdi.blogApp.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.ui.Model;


import java.util.List;


@RequiredArgsConstructor
@Controller
public class WebController {
    private final PostService postService;
    private final CommentService commentService;

    @GetMapping("/")
    public String home() {
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String loginPage() {
        return "login"; // will look for templates/login.html
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @GetMapping("/posts")
    public String postsPage(Model model) {
        // you can later add: model.addAttribute("posts", postService.getAllPosts());
        List<PostModel> posts = postService.getAllPosts();
        model.addAttribute("posts", postService.getAllPosts());
        return "posts";
    }

//    @GetMapping("/comments/{postId}")
//    public String commentsPage(@PathVariable Long postId, Model model) {
//        List<CommentModel> comments = commentService.getCommentsByPostId(postId);
//        model.addAttribute("comments", comments);
//        model.addAttribute("postId", postId);
//        return "comments";
//    }

    @GetMapping("/users")
    public String usersPage(Model model) {
        return "users";
    }
}

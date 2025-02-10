package com.damul.api.post.service;


import com.damul.api.auth.dto.response.UserInfo;
import com.damul.api.common.comment.CommentCreate;
import com.damul.api.common.dto.response.CreateResponse;
import com.damul.api.common.scroll.dto.response.ScrollResponse;
import com.damul.api.post.dto.request.PostRequest;
import com.damul.api.post.dto.response.PostDetail;
import com.damul.api.post.dto.response.PostList;
import org.springframework.web.multipart.MultipartFile;

public interface PostService {

    // 게시글 전체 조회/검색
    ScrollResponse<PostList> getPosts(int cursor, int size, String searchType,
                                      String keyword, String status, String orderBy);

    // 게시글 상세조회
    PostDetail getPostDetail(int postId, UserInfo userInfo);

    // 게시글 작성
    CreateResponse addPost(UserInfo userInfo, PostRequest postRequest, MultipartFile thumbnailImage);

    // 게시글 수정
    CreateResponse updatePost(int postId, UserInfo userInfo, PostRequest postUpdateRequest, MultipartFile thumbnailImage);
    
    // 게시글 삭제
    void deletePost(int postId, UserInfo userInfo);
    
    // 댓글 작성
    CreateResponse addPostComment(int postId, CommentCreate commentCreate, UserInfo userInfo);

    // 댓글 삭제


//    // 게시글 현황 변경
//    void changePostStatus(int postId);

}

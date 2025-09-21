"use client";

import { useState, useEffect } from "react";
import { MessageCircle, Reply } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CommentForm from "./CommentForm";

interface Comment {
  _id: string;
  content: string;
  _createdAt: string;
  author: {
    _id: string;
    name: string;
    username: string;
    image?: string;
  };
  replies?: Comment[];
}

interface CommentListProps {
  startupId: string;
  refreshTrigger?: number;
}

const CommentList = ({ startupId, refreshTrigger }: CommentListProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      console.log("Fetching comments for startup:", startupId);
      const response = await fetch(`/api/startup/${startupId}/comments`);
      console.log("Comments API response:", response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log("Comments data:", data);
        console.log("Comments with replies:", data.comments?.map((c: any) => ({ 
          id: c._id, 
          content: c.content, 
          repliesCount: c.replies?.length || 0,
          replies: c.replies 
        })));
        setComments(data.comments || []);
      } else {
        console.error("Failed to fetch comments:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [startupId, refreshTrigger]);

  const handleCommentAdded = () => {
    fetchComments();
    setReplyingTo(null);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments
        </h3>
        <div className="text-center py-4">Loading comments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Comments ({comments.length})
      </h3>

      {comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="border-l-2 border-gray-200 pl-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-semibold">
                    {comment.author.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{comment.author.name}</p>
                    <p className="text-xs text-gray-500">
                      @{comment.author.username} • {formatDate(comment._createdAt)}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-800 mb-3">{comment.content}</p>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                  className="text-xs"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Reply
                </Button>

                {replyingTo === comment._id && (
                  <div className="mt-3">
                    <CommentForm
                      startupId={startupId}
                      parentCommentId={comment._id}
                      onCommentAdded={handleCommentAdded}
                      placeholder={`Reply to ${comment.author.name}...`}
                    />
                  </div>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply._id} className="bg-white rounded-lg p-3 border">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                            {reply.author.name?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-xs">{reply.author.name}</p>
                            <p className="text-xs text-gray-500">
                              @{reply.author.username} • {formatDate(reply._createdAt)}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-800 text-sm">{reply.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;

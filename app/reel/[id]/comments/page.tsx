"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Send, MoreVertical, Edit, Trash2 } from "lucide-react"
import Image from "next/image"

interface Comment {
  id: string
  username: string
  avatarUrl?: string
  text: string
  createdAt: string
  isOwner?: boolean
}

export default function CommentsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [commentsDisabled, setCommentsDisabled] = useState(false)
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null)
  const [editText, setEditText] = useState("")
  const editInputRef = useRef<HTMLInputElement>(null)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    // In a real app, fetch comments from an API
    // For now, we'll use mock data
    setTimeout(() => {
      setComments([
        {
          id: "1",
          username: "basketball_fan",
          avatarUrl: "/placeholder.svg?height=40&width=40",
          text: "This is amazing! Never knew these details about his career.",
          createdAt: "2023-06-15T12:34:56.789Z",
        },
        {
          id: "2",
          username: "sports_lover",
          text: "Great video! Would love to see more about his time with the Bulls.",
          createdAt: "2023-06-15T13:45:12.345Z",
        },
        {
          id: "3",
          username: "chicago_bulls",
          avatarUrl: "/placeholder.svg?height=40&width=40",
          text: "The GOAT! 🐐",
          createdAt: "2023-06-15T14:22:33.456Z",
        },
        {
          id: "4",
          username: "current_user",
          text: "I've been a fan since I was a kid!",
          createdAt: "2023-06-15T15:10:45.678Z",
          isOwner: true,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Focus the edit input when editing starts
    if (editingCommentId && editInputRef.current) {
      editInputRef.current.focus()
    }
  }, [editingCommentId])

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()

    if (!newComment.trim() || commentsDisabled) return

    // In a real app, send the comment to an API
    // For now, we'll just add it to the local state
    const newCommentObj: Comment = {
      id: `comment-${Date.now()}`,
      username: "current_user",
      text: newComment,
      createdAt: new Date().toISOString(),
      isOwner: true,
    }

    setComments([...comments, newCommentObj])
    setNewComment("")
  }

  const startEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id)
    setEditText(comment.text)
    setActiveDropdown(null)
  }

  const cancelEditComment = () => {
    setEditingCommentId(null)
    setEditText("")
  }

  const saveEditComment = () => {
    if (!editText.trim() || !editingCommentId) return

    setComments(
      comments.map((comment) =>
        comment.id === editingCommentId
          ? {
              ...comment,
              text: editText,
              // In a real app, you might want to add an "edited" flag or timestamp
            }
          : comment,
      ),
    )
    setEditingCommentId(null)
    setEditText("")
  }

  const deleteComment = (commentId: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      setComments(comments.filter((comment) => comment.id !== commentId))
    }
    setActiveDropdown(null)
  }

  const toggleCommentsDisabled = () => {
    setCommentsDisabled(!commentsDisabled)
  }

  const toggleDropdown = (commentId: string) => {
    setActiveDropdown(activeDropdown === commentId ? null : commentId)
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="p-4 flex items-center justify-between bg-black sticky top-0 z-10 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-800">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-bold">Comments</h1>
        </div>
        <button
          onClick={toggleCommentsDisabled}
          className={`text-sm px-3 py-1 rounded-full ${commentsDisabled ? "bg-blue-600" : "bg-gray-700"}`}
        >
          {commentsDisabled ? "Enable Comments" : "Disable Comments"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">No comments yet. Be the first to comment!</div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 relative group">
              <div className="w-10 h-10 rounded-full bg-gray-700 flex-shrink-0 overflow-hidden">
                {comment.avatarUrl ? (
                  <Image
                    src={comment.avatarUrl || "/placeholder.svg"}
                    alt={comment.username}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white font-bold">
                    {comment.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{comment.username}</span>
                  <span className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>

                {editingCommentId === comment.id ? (
                  <div className="mt-1 flex items-center gap-2">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 bg-gray-800 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={saveEditComment} className="text-blue-500 text-sm">
                      Save
                    </button>
                    <button onClick={cancelEditComment} className="text-gray-400 text-sm">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <p className="text-sm mt-1">{comment.text}</p>
                )}
              </div>

              {comment.isOwner && !editingCommentId && (
                <div className="relative">
                  <button
                    onClick={() => toggleDropdown(comment.id)}
                    className="p-1 rounded-full hover:bg-gray-800 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {activeDropdown === comment.id && (
                    <div className="absolute right-0 top-6 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-10 w-32">
                      <button
                        onClick={() => startEditComment(comment)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 w-full text-left text-sm"
                      >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteComment(comment.id)}
                        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 w-full text-left text-sm text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {commentsDisabled ? (
        <div className="p-4 border-t border-gray-800 text-center text-gray-400">
          Comments are disabled for this reel
        </div>
      ) : (
        <form onSubmit={handleSubmitComment} className="p-4 border-t border-gray-800 sticky bottom-0 bg-black">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="p-2 bg-blue-600 rounded-full disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

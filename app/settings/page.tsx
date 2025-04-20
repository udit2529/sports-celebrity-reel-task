"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [darkMode, setDarkMode] = useState(true)
  const [autoplay, setAutoplay] = useState(true)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      router.push("/auth/login")
    }
  }, [user, router])

  const handleLogout = () => {
    if (confirm("Are you sure you want to log out?")) {
      logout()
    }
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="p-4 flex items-center gap-3 bg-black sticky top-0 z-10 border-b border-gray-800">
        <Link href="/profile" className="p-2 rounded-full hover:bg-gray-800">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-lg font-bold">Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preferences</h2>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <h3 className="font-medium">Dark Mode</h3>
              <p className="text-sm text-gray-400">Use dark theme</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <h3 className="font-medium">Autoplay Videos</h3>
              <p className="text-sm text-gray-400">Play videos automatically when in view</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoplay}
                onChange={() => setAutoplay(!autoplay)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
            <div>
              <h3 className="font-medium">Notifications</h3>
              <p className="text-sm text-gray-400">Receive notifications for likes and comments</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account</h2>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <LogOut className="h-5 w-5 text-red-500" />
            <span>Log Out</span>
          </button>
        </div>

        <div className="pt-4 text-center text-sm text-gray-500">
          <p>Sports Celebrity Reels v1.0.0</p>
          <p className="mt-1">© 2023 All Rights Reserved</p>
        </div>
      </div>
    </div>
  )
}

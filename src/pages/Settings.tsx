import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Bell, Shield, Palette,
  Globe, Volume2, Play, Monitor, Moon, Sun, Smartphone,
  Mail, Lock, User, Trash2, Download
} from "lucide-react";
import { Link } from "react-router-dom";

const Settings = () => {
  const [notifications, setNotifications] = useState({
    newEpisodes: true,
    recommendations: true,
    creatorUpdates: false,
    weeklyDigest: true,
  });
  
  const [playback, setPlayback] = useState({
    autoplay: true,
    defaultSpeed: 1,
    quality: "auto",
  });

  const settingsSections = [
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { key: "newEpisodes", label: "New Episodes", description: "Get notified when creators upload" },
        { key: "recommendations", label: "Recommendations", description: "Personalized content suggestions" },
        { key: "creatorUpdates", label: "Creator Updates", description: "News from creators you follow" },
        { key: "weeklyDigest", label: "Weekly Digest", description: "Summary of top content" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card rounded-none border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-4">
            <Link to="/profile" className="p-2 rounded-xl hover:bg-muted transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="font-display text-xl font-bold">Settings</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Account Section */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Account
          </h2>
          <div className="glass-card divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">alex@example.com</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">Password</p>
                  <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
        </section>

        {/* Notifications Section */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            Notifications
          </h2>
          <div className="glass-card divide-y divide-border">
            {settingsSections[0].items.map((item) => (
              <div key={item.key} className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <button
                  onClick={() =>
                    setNotifications((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev],
                    }))
                  }
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    notifications[item.key as keyof typeof notifications]
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                >
                  <motion.div
                    layout
                    className="absolute top-1 w-5 h-5 rounded-full bg-white"
                    style={{
                      left: notifications[item.key as keyof typeof notifications] ? "calc(100% - 24px)" : "4px",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Playback Section */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-primary" />
            Playback
          </h2>
          <div className="glass-card divide-y divide-border">
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Autoplay</p>
                <p className="text-sm text-muted-foreground">Play next video automatically</p>
              </div>
              <button
                onClick={() =>
                  setPlayback((prev) => ({ ...prev, autoplay: !prev.autoplay }))
                }
                className={`relative w-12 h-7 rounded-full transition-colors ${
                  playback.autoplay ? "bg-primary" : "bg-muted"
                }`}
              >
                <motion.div
                  layout
                  className="absolute top-1 w-5 h-5 rounded-full bg-white"
                  style={{
                    left: playback.autoplay ? "calc(100% - 24px)" : "4px",
                  }}
                />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Default Speed</p>
                <p className="text-sm text-muted-foreground">Playback speed preference</p>
              </div>
              <select
                value={playback.defaultSpeed}
                onChange={(e) =>
                  setPlayback((prev) => ({
                    ...prev,
                    defaultSpeed: parseFloat(e.target.value),
                  }))
                }
                className="bg-muted rounded-lg px-3 py-2 text-sm"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Video Quality</p>
                <p className="text-sm text-muted-foreground">Default streaming quality</p>
              </div>
              <select
                value={playback.quality}
                onChange={(e) =>
                  setPlayback((prev) => ({ ...prev, quality: e.target.value }))
                }
                className="bg-muted rounded-lg px-3 py-2 text-sm"
              >
                <option value="auto">Auto</option>
                <option value="1080p">1080p</option>
                <option value="720p">720p</option>
                <option value="480p">480p</option>
              </select>
            </div>
          </div>
        </section>

        {/* Data & Privacy */}
        <section className="mb-8">
          <h2 className="font-display text-lg font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Data & Privacy
          </h2>
          <div className="glass-card divide-y divide-border">
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-muted-foreground" />
                <p className="font-medium">Download My Data</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-destructive" />
                <p className="font-medium text-destructive">Delete Account</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </section>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>PodStream v1.0.0</p>
          <p>Made with ❤️ for podcast lovers</p>
        </div>
      </main>
    </div>
  );
};

export default Settings;

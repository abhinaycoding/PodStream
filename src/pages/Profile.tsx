import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Play, Settings, LogOut, ChevronLeft, ChevronRight,
  Edit2, Camera, TrendingUp, Clock, Heart, Bookmark,
  Award, Flame
} from "lucide-react";
import { Link } from "react-router-dom";

const userStats = {
  hoursWatched: 127,
  videosCompleted: 89,
  streak: 14,
  savedVideos: 45,
};

const recentActivity = [
  {
    id: "1",
    title: "The Future of AI: A Deep Dive",
    action: "Watched",
    time: "2 hours ago",
  },
  {
    id: "2",
    title: "Building a $100M Startup",
    action: "Saved",
    time: "Yesterday",
  },
  {
    id: "3",
    title: "The Science of Sleep",
    action: "Liked",
    time: "2 days ago",
  },
];

const interests = [
  "Technology", "Business", "Startups", "Health", "Gaming"
];

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Alex Johnson");
  const [bio, setBio] = useState("Podcast enthusiast | Tech lover | Always learning");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-card rounded-none border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/dashboard" className="p-2 rounded-xl hover:bg-muted transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <h1 className="font-display text-xl font-bold">Profile</h1>
            </div>
            
            <Link to="/settings" className="p-2 rounded-xl hover:bg-muted transition-colors">
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6 sm:p-8 mb-8"
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-primary p-0.5">
                <img
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face"
                  alt="Profile"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Camera className="w-4 h-4 text-background" />
              </button>
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-glass text-xl font-bold"
                  />
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="input-glass resize-none"
                    rows={2}
                  />
                </div>
              ) : (
                <>
                  <h2 className="font-display text-2xl font-bold mb-1">{name}</h2>
                  <p className="text-muted-foreground mb-4">{bio}</p>
                </>
              )}
              
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-4">
                {interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Edit button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`${isEditing ? 'btn-gradient' : 'btn-ghost'} self-start`}
            >
              {isEditing ? (
                <span>Save</span>
              ) : (
                <span className="flex items-center gap-2">
                  <Edit2 className="w-4 h-4" />
                  Edit
                </span>
              )}
            </button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Clock, label: "Hours Watched", value: userStats.hoursWatched, color: "from-blue-500 to-cyan-500" },
            { icon: TrendingUp, label: "Videos Completed", value: userStats.videosCompleted, color: "from-green-500 to-emerald-500" },
            { icon: Flame, label: "Day Streak", value: userStats.streak, color: "from-orange-500 to-red-500" },
            { icon: Bookmark, label: "Saved Videos", value: userStats.savedVideos, color: "from-purple-500 to-pink-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-4 text-center"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mx-auto mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-display text-2xl font-bold mb-1">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6 mb-8"
        >
          <h3 className="font-display text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    {activity.action === "Watched" && <Play className="w-4 h-4 text-primary" />}
                    {activity.action === "Saved" && <Bookmark className="w-4 h-4 text-primary" />}
                    {activity.action === "Liked" && <Heart className="w-4 h-4 text-primary" />}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Link to="/settings">
            <motion.div
              whileHover={{ x: 4 }}
              className="glass-card-hover p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-muted-foreground" />
                <span>Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </motion.div>
          </Link>
          
          <Link to="/">
            <motion.div
              whileHover={{ x: 4 }}
              className="glass-card-hover p-4 flex items-center justify-between text-destructive"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </div>
              <ChevronRight className="w-5 h-5" />
            </motion.div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Profile;

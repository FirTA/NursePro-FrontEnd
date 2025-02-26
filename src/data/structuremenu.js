import { AccountCircle, ListAlt, PeopleAlt } from "@mui/icons-material";
import { BarChart, Calendar, FileText, Home, Settings } from "lucide-react";

export const Menus = [
    {
        Role: "Management",
        Menu: [
            {
                title: "Profile",
                urlpath: "/profile",
                icon: <AccountCircle className="w-5 h-5" />,
                submenu: []
            },
            {
                title: "Dashboard",
                icon: <Home className="w-5 h-5" />,
                urlpath: "/dashboard",
                submenu: []
            },
            {
                title: "Counseling",
                icon: <Calendar className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Schedule Sessions",
                        urlpath: "/counseling"
                    },
                    {
                        title: "Session Notes",
                        urlpath: "/session-notes/by-counseling"
                    },

                ]
            },
            {
                title: "Nurse Management",
                icon: <PeopleAlt className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Nurse List",
                        urlpath: "/nurse-list"
                    },
                ]
            },
        ]
    },
    {
        Role: "Nurse",
        Menu: [
            {
                title: "Profile",
                icon: <AccountCircle className="w-5 h-5" />,
                urlpath: "/profile",
                submenu: []
            },
            {
                title: "Dashboard",
                icon: <Home className="w-5 h-5" />,
                urlpath: "/dashboard",
                submenu: []
            },
            {
                title: "Counseling",
                icon: <Calendar className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Schedule List",
                        urlpath: "/counseling"
                    },
                    {
                        title: "Session Notes",
                        urlpath: "/session-notes"
                    }
                ]
            },
            {
                title: "Career Path",
                icon: <BarChart className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Current Level",
                        urlpath: "/career-path"
                    },
                    // {
                    //     title: "Progress Tracker",
                    //     urlpath: "/"
                    // }
                ]
            }
        ]
    },
    {
        Role: "Admin",
        Menu: [
            {
                title: "User Management",
                icon: <PeopleAlt className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Manage Users",
                        urlpath: "/user-manage"
                    },
                ]
            },
            {
                title: "System Settings",
                icon: <Settings className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Level Settings",
                        urlpath: "/levels"
                    },
                    // {
                    //     title: "System Configurations",
                    //     urlpath: "/system-config"
                    // }
                ]
            }
        ]
    }
]

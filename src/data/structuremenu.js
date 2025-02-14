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
                        title: "Material Preparation",
                        urlpath: "/materials"
                    },
                    {
                        title: "Session History",
                        urlpath: "/counseling"
                    },
                    {
                        title: "Violation Cases",
                        urlpath: "/counseling"
                    }
                ]
            },
            {
                title: "Nurse Management",
                icon: <PeopleAlt className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Nurse List",
                        urlpath: "/nurse-career"
                    },
                    {
                        title: "Level Approval",
                        urlpath: "/"
                    },
                    {
                        title: "Performance Tracker",
                        urlpath: "/"
                    }
                ]
            },
            {
                title: "Materials",
                icon: <FileText className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Material Library",
                        urlpath: "/materials"
                    },
                    {
                        title: "Assign Materials",
                        urlpath: "/"
                    }
                ]
            }
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
                        title: "Prepare Materials",
                        urlpath: "/materials"
                    },
                    {
                        title: "Session Notes",
                        urlpath: "/"
                    }
                ]
            },
            {
                title: "Career Path",
                icon: <BarChart className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Current Level",
                        urlpath: "/career path"
                    },
                    {
                        title: "Progress Tracker",
                        urlpath: "/"
                    }
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
                        urlpath: "/usermanage"
                    },
                    {
                        title: "Manage Nurses",
                        urlpath: "/nursemanage"
                    },
                    {
                        title: "Manage Management",
                        urlpath: "/managementmanage"
                    }
                ]
            },
            {
                title: "References",
                icon: <ListAlt className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Level Configuration",
                        urlpath: "/levelrules"
                    },
                    {
                        title: "Level Status",
                        urlpath: "/levelstatus"
                    },
                    {
                        title: "Counseling Types",
                        urlpath: "/counselingtypes"
                    },
                    {
                        title: "Counseling Status",
                        urlpath: "/counselingstatus"
                    },
                    {
                        title: "Material Categories",
                        urlpath: "/materialcategories"
                    },
                    {
                        title: "Department Categories",
                        urlpath: "/departmentcategories"
                    }
                ]
            },
            {
                title: "System Settings",
                icon: <Settings className="w-5 h-5" />,
                submenu: [
                    {
                        title: "Audit Logs",
                        urlpath: "/activityaudit"
                    },
                    {
                        title: "System Configurations",
                        urlpath: "/systemconfig"
                    }
                ]
            }
        ]
    }
]

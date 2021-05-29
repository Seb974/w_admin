function getRoles() {
    return [
        {value: "ROLE_SUPER_ADMIN",  label: "Super administrateur",      isFixed: true},
        {value: "ROLE_ADMIN",        label: "Administrateur",            isFixed: true},
        {value: "ROLE_TEAM",         label: "Utilisateur interne",       isFixed: false},
        {value: "ROLE_VIP",          label: "Professionnel VIP",         isFixed: false},
        {value: "ROLE_GC",           label: "Grand compte",              isFixed: false},
        {value: "ROLE_CHR",          label: "Café-Hotel-Restaurant",     isFixed: false},
        {value: "ROLE_PRO",          label: "Professionnel",             isFixed: false},
        {value: "ROLE_USER_EXT_VIP", label: "Particulier extérieur VIP", isFixed: false},
        {value: "ROLE_USER_VIP",     label: "Particulier VIP",           isFixed: false},
        {value: "ROLE_USER_EXT",     label: "Particulier extérieur",     isFixed: false},
        {value: "ROLE_USER",         label: "Particulier",               isFixed: false},
    ];
}

function filterRoles(roles) {
    const userRoles = roles.filter(role => role !== ["ROLE_USER"]);
    return userRoles.length > 0 ? userRoles[0] : ["ROLE_USER"];
}

function hasPrivileges(user) {
    return ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_TEAM"].includes(user.roles);
}

function hasAdminPrivileges(user) {
    return ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"].includes(user.roles);
}

function hasAllPrivileges(user) {
    return user.roles === "ROLE_SUPER_ADMIN";
}

function getDefaultRole() {
    return "ROLE_USER";
}

function getRoleLabel(userRoles) {
    const roles = getRoles();
    const userRole = filterRoles(userRoles);
    return roles.find(role => userRole === role.value).label;
}

export default {
    getRoles,
    filterRoles,
    getDefaultRole,
    hasPrivileges,
    hasAdminPrivileges,
    hasAllPrivileges,
    getRoleLabel
}
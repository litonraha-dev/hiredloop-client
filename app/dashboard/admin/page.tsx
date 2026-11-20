import { requireRole } from "@/lib/authorization";
import { USER_ROLES } from "@/lib/roles";

const AdminDashboardPage = async () => {
    await requireRole(USER_ROLES.ADMIN);
    return (
        <div>
            admin dashboard page
        </div>
    );
};

export default AdminDashboardPage;

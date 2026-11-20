import { requireRole } from "@/lib/authorization";
import { USER_ROLES } from "@/lib/roles";

const SeekerDashboardPage = async () => {
    await requireRole(USER_ROLES.SEEKER);
    return (
        <div>
            Seeker Dashboard Page
        </div>
    );
};

export default SeekerDashboardPage;

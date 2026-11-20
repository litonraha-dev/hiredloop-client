import { requireRole } from "@/lib/authorization";
import { USER_ROLES } from "@/lib/roles";

const RecruiterDashboardPage = async () => {
    await requireRole(USER_ROLES.RECRUITER);
    return (
        <div>
           Recruiter dashboard page 
        </div>
    );
};

export default RecruiterDashboardPage;

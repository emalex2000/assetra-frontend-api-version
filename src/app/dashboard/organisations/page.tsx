import OrganisationList from "@/components/dashboard/OrganisationsPanel";
import DashboardNav from "../../../../components/dashboard/DashboardNav";
import CreateOrganisationCard from "@/components/dashboard/CreateOrganisations";
import OrganisationSearchSection from "@/components/dashboard/OrganisationSearchSection";

export default function OrganisationsPage(){
    return(
        <>
            <DashboardNav>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-3">
                        <OrganisationList/>
                        <CreateOrganisationCard/>
                    </div>

                    <div>
                        <OrganisationSearchSection/>
                    </div>
                </div>
            </DashboardNav>
        </>
    )
}
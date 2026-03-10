import { useState } from "react";
import ShowsSection from "../../components/admin/ShowsSection";
import UsersSection from "../../components/admin/UsersSection";
import HuntersSection from "../../components/admin/HuntersSection";
import CategoriesSection from "../../components/admin/CategoriesSection"

const AdminPage = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <div className="accordion game-accordion" id="adminAccordion">

      <ShowsSection
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <UsersSection
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <HuntersSection
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <CategoriesSection
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

    </div>
  );
};

export default AdminPage;
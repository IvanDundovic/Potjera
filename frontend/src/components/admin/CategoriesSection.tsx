import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface CategoryDto{
    id: number,
    name: string,
    description: string
};

interface Props {
  activeSection: string | null;
  setActiveSection: React.Dispatch<React.SetStateAction<string | null>>;
}

const CategoriesSection = ({activeSection, setActiveSection}:Props) => {
    const [categories, setCategories] = useState<CategoryDto[] | undefined>(undefined);
    const isOpen = activeSection === "categories";
    const [openCategoriesId, setOpenCategoriesId] = useState<number | null>(null)

    async function fetchCategories() {
        axiosInstance.get("api/v1/Episode/getCategories")
        .then((response) => {
            setCategories(response.data.categories);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        if(isOpen) fetchCategories();
    }, [isOpen]);

    return (
  <div className="accordion game-accordion" id="accordionExample">
    <div className="accordion-item game-main-item">
      <h2 className="accordion-header">
        <button
          className={`accordion-button game-main-button ${
            isOpen ? "" : "collapsed"
          }`}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#collapseFour"
          aria-expanded={isOpen}
          aria-controls="collapseFour"
          onClick={() => setActiveSection(isOpen ? null : "categories")}
        >
          KATEGORIJE
        </button>
      </h2>

      <div
        id="collapseFour"
        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body game-main-body">
          {categories?.map((categories) => (
            <div key={categories.id} className="accordion-item game-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button game-button ${
                    openCategoriesId === categories.id ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() =>
                    setOpenCategoriesId(
                      openCategoriesId === categories.id ? null : categories.id
                    )
                  }
                >
                  {categories.name}
                </button>
              </h2>

              <div
                className={`accordion-collapse collapse ${
                openCategoriesId === categories.id ? "show" : ""
                }`}
              >
                <div className="accordion-body game-body">
                  {categories.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}

export default CategoriesSection;
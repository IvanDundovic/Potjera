import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface HuntersDto{
    id: number,
    name: string,
    description: string
};

interface Props {
  activeSection: string | null;
  setActiveSection: React.Dispatch<React.SetStateAction<string | null>>;
}

const HuntersSection = ({activeSection, setActiveSection} : Props) => {
    const [hunters, setHunters] = useState<HuntersDto[] | undefined>(undefined);
    const isOpen = activeSection === "hunters";
    const [openHuntersId, setOpenHuntersId] = useState<number | null>(null)
    async function fetchHunters() {
        axiosInstance.get("api/v1/Episode/getHunters")
        .then((response) => {
            setHunters(response.data.hunters);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        if(isOpen) fetchHunters();
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
          data-bs-target="#collapseThree"
          aria-expanded={isOpen}
          aria-controls="collapseThree"
          onClick={() => setActiveSection(isOpen ? null : "hunters")}
        >
          LOVCI
        </button>
      </h2>

      <div
        id="collapseThree"
        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body game-main-body">
          {hunters?.map((hunters) => (
            <div key={hunters.id} className="accordion-item game-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button game-button ${
                    openHuntersId === hunters.id ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() =>
                    setOpenHuntersId(
                      openHuntersId === hunters.id ? null : hunters.id
                    )
                  }
                >
                  {hunters.name}
                </button>
              </h2>

              <div
                className={`accordion-collapse collapse ${
                openHuntersId === hunters.id ? "show" : ""
                }`}
              >
                <div className="accordion-body game-body">
                  {hunters.description}
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

export default HuntersSection;
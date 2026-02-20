import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";

interface Props {
  activeSection: string | null;
  setActiveSection: React.Dispatch<React.SetStateAction<string | null>>;
}

interface ShowDto {
  id: number;
  name: string;
  description: string;
}

const ShowSection = ({activeSection, setActiveSection} : Props) => {
  const [shows, setShows] = useState<ShowDto[] | undefined>(undefined);
  const isOpen = activeSection === "shows";
  const [openShowId, setOpenShowId] = useState<number | null>(null);

  async function fetchShows() {
    axiosInstance
      .get("api/v1/Episode/getShows")
      .then((response) => {
        setShows(response.data.shows);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    if (isOpen) fetchShows();
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
          data-bs-target="#collapseOne"
          aria-expanded={isOpen}
          aria-controls="collapseOne"
          onClick={() => setActiveSection(isOpen ? null : "shows")}
        >
          EMISIJE
        </button>
      </h2>

      <div
        id="collapseOne"
        className={`accordion-collapse collapse ${isOpen ? "show" : ""}`}
        data-bs-parent="#accordionExample"
      >
        <div className="accordion-body game-main-body">
          {shows?.map((show) => (
            <div key={show.id} className="accordion-item game-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button game-button ${
                    openShowId === show.id ? "" : "collapsed"
                  }`}
                  type="button"
                  onClick={() =>
                    setOpenShowId(
                      openShowId === show.id ? null : show.id
                    )
                  }
                >
                  {show.name}
                </button>
              </h2>

              <div
                className={`accordion-collapse collapse ${
                openShowId === show.id ? "show" : ""
                }`}
              >
                <div className="accordion-body game-body">
                  {show.description}
                </div>
                <button className="game-button">+ Dodaj epizodu</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

};

export default ShowSection;

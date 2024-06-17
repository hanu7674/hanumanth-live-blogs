import React from "react";
import { Button } from "rsuite";
const Pagination = ({ currentPage, handlePageChange, noOfPages }) => {
  return (
    <div>
      <div className="row mx-0">
        <div className="col-12 text-center pb-4 pt-4">
          <Button
            className="btn_mange_pagging"
            disabled={currentPage === 1}
            onClick={() => handlePageChange("Prev")}
          >
            <i className="fa fa-long-arrow-left"></i>&nbsp;&nbsp;Prev
          </Button>
          <span className="btn_pagging">{currentPage}</span>
          <Button
            className="btn_mange_pagging"
            disabled={currentPage === noOfPages}
            onClick={() => handlePageChange("Next")}
          >
            Next <i className="fa fa-long-arrow-right"></i>&nbsp;&nbsp;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;

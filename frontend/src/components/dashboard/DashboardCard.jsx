import React from "react";

function DashboardCard({

    title,
    value,
    icon,
    color = "primary"

}) {

    return (

        <div className="col-md-6 col-lg-3 mb-4">

            <div className={`card border-0 shadow-sm border-start border-4 border-${color}`}>

                <div className="card-body">

                    <div className="d-flex justify-content-between align-items-center">

                        <div>

                            <h6 className="text-muted mb-2">

                                {title}

                            </h6>

                            <h2 className="fw-bold mb-0">

                                {value}

                            </h2>

                        </div>

                        <div
                            className={`text-${color}`}
                            style={{ fontSize: "40px" }}
                        >

                            {icon}

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default DashboardCard;
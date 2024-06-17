import React from "react";
import "./index.css"
import { FaCaretRight } from "react-icons/fa"
const BreadCrumb = ({items}) =>{

    return (
        <> 
          
        <div className="container container-md-fluid breadcrumb-main" >
    <div className="row ">
        <div className="col-auto col-md-12    ">
            <div className="bc-icons-2 ">
                <nav aria-label="breadcrumb " className="first" >
                <ol className="breadcrumb indigo first mb-5 mb-4 px-md-4">

                    {
                        items?.map((item, i) =>(
                        <li key={i} className="breadcrumb-item fst-italic"><a className= {`text-dark  text-uppercase ${items.length-1 === i ? 'active-1 fw-bold': ''}`} href={item.link}><span className="mr-md-3 mr-2 breadcrumb-item-name">{item.name}</span>
                        {items.length-1 === i ? <></>: <>
                        <FaCaretRight size={25} style={{color: "rgb(0, 183, 255)"}} className="fa-caret-right"/>
                        </>}
                        </a></li>
                        )) 
                    }
                        </ol>

                </nav>
            </div>
        </div>
    </div>
</div>
        </>
    )
}

export default BreadCrumb;
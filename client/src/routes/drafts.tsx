import React, { useState } from "react";
import { NavBar } from "../components/navBar";
import { DraftInfo } from "../components/draftInfo/draftInfo";

/**
 * Routes of draft page.
 */
export default function Drafts() {
    const [currDraftId, setCurrtDraftId] = useState("");

    const handleDraftClick = (draftId: string) => { 
        setCurrtDraftId(draftId);
    }

    return (
        <>
            <NavBar setDraftId={handleDraftClick} />
            <DraftInfo draftId={currDraftId} />
        </>
    );
};
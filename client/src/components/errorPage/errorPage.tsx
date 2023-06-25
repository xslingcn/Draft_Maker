import React from "react";
import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

/**
 * Component for displaying error page.
 */
export default function ErrorPage() {
    const error = useRouteError();
    console.error(error);

    if (isRouteErrorResponse(error)) {
        return (
            <div id="error-page">
                <h1>Oops! {error.status}</h1>
                <p>{error.statusText}</p>
                {error.data?.message && (
                    <p>
                        <i>{error.data.message}</i>
                    </p>
                )}
                <Link to="/">Go to Home Page</Link>
            </div>
        );
    } else if (error instanceof Error) {
        return (
            <div id="error-page">
                <h1>Oops! Unexpected Error</h1>
                <p>Something went wrong.</p>
                <p>
                    <i>{error.message}</i>
                </p>
                <Link to="/">Go to Home Page</Link>
            </div>
        );
    } else {
        return (
            <div id="error-page">
                <h1>Oops! Unexpected Error</h1>
                <p>Something went wrong.</p>
                <p>
                    <i>Unknown Error</i>
                </p>
                <Link to="/">Go to Home Page</Link>
            </div>
        );
    }
}
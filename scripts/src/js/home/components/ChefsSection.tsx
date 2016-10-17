import * as React from "react";

import {Chef} from "../models/pizza";

interface ChefsSectionProps {
    chefs: Chef[]
}

class ChefsSection extends React.Component<ChefsSectionProps, void> {
    render() {
        const {chefs} = this.props;
        console.log(chefs);
        const chefsList = chefs.map((chef: Chef, index) => {
            return (
                <li key={index}>
                    {chef.address}[{chef.roles}]: {chef.status}
                </li>
            );
        });
        return(
            <div>
                <h2>Your Chefs.</h2>
                <ul>
                    {chefsList}
                </ul>
            </div>
        );
    }
}

export default ChefsSection;
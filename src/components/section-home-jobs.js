import React from "react";
import { Wrapper } from "./style/global-styles";
import styled from "styled-components";
import { changeBodyClass, stringToSlug } from "../functions/util";

export default function SectionJobs({ jobs }) {
	return (
		<JobSection className="pV">
			{jobs.map((item, i) => {
				const slug = stringToSlug(item.name);
				return (
					<JobItem
						key={i}
						className={`${
							!item.date.includes("Present") ? `inactive` : `active`
						}`}
						onMouseEnter={() => changeBodyClass("enter", `job-${slug}`)}
						onMouseLeave={() => changeBodyClass("exit", `job-${slug}`)}
					>
						<h3 className="display">{item.title} </h3>

						<aside>
							<h4>{item.name} </h4>
							<h4>{item.date} </h4>
						</aside>
					</JobItem>
				);
			})}
		</JobSection>
	);
}

const JobSection = styled(Wrapper)`
	background-color: ${(props) => props.theme.colors.gray4};
`;

const JobItem = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 2rem;

	&:last-child {
		margin-bottom: 0;
	}

	&.inactive {
		h3 {
			text-decoration: line-through;
			text-decoration-thickness: 0.065em;
			text-decoration-color: ${(props) => props.theme.colors.gray2};
			color: ${(props) => props.theme.colors.gray3};
		}
		h4 {
			color: ${(props) => props.theme.colors.gray3};
		}
	}

	aside {
		text-align: right;

		* {
			margin: 0;
		}
	}
`;

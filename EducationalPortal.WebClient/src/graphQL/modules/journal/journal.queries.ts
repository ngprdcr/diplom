import {gql} from "@apollo/client";

export const setJournalMarkMutation = gql`
    mutation ($input: SetJournalMarkInputType!) {
        setJournalMark(input: $input)
    }
`;

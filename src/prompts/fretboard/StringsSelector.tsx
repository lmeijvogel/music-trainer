import styled from "styled-components";

const allStrings = ["E5", "B4", "G4", "D4", "A3", "E3"];

type Props = { strings: string[], onChange: (strings: string[]) => void };

export const StringsSelector = ({ strings, onChange }: Props) => {
    const lowestString = strings.length;

    const selectCumulative = (
        allEntries: string[],
        selectedEntries: string[],
        index: number,
        checked: boolean
    ): string[] => {
        const highestSelectedIndex = selectedEntries.length;

        // When clicking the lowest selected item, then just toggle that one on/off,
        // If any other item is clicked, that item will be the new lowest one.
        const highestSelectedIndexClicked = !checked && index === highestSelectedIndex - 1;
        const newHighestSelectedIndex = highestSelectedIndexClicked ? index - 1 : index;

        return allEntries.slice(0, newHighestSelectedIndex + 1);
    };
    const onStringChange = (i: number, checked: boolean) => {
        onChange(selectCumulative(allStrings, strings, i, checked));
    };

    return <StringsList>
        {allStrings.map((str, i) => (
            <ListItem key={str}>
                <Checkbox i={i} checked={i < lowestString} onChange={onStringChange}>
                    {str[0]}
                </Checkbox>
            </ListItem>
        ))}
    </StringsList>

};

const Checkbox = <T,>({
    i,
    checked,
    children,
    onChange
}: {
    i: T;
    checked: boolean;
    children: JSX.Element | string;
    onChange: (i: T, newValue: boolean) => void;
}) => {
    const onCheckboxChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
        onChange(i, event.target.checked);
    };

    return (
        <label>
            <StyledInput type="checkbox" checked={checked} onChange={onCheckboxChange} />
            {children}
        </label>
    );
};

const StringsList = styled.ul`
    display: flex;
    flex-direction: column;

    padding: 0;

    align-items: center;
    text-align: center;
`;

const ListItem = styled.li`
    list-style-type: none;
`;

const StyledInput = styled.input`
    margin-right: 12px;
`;


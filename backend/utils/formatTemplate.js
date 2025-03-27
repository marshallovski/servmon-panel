async function formatTemplate(template, values) {
    const regex = /%\{(\w+)\}/g;
    const matches = [...template.matchAll(regex)]; // Get all matches

    let result = template; // Start with the original template

    for (const match of matches) {
        const key = match[1]; // Get the key (like "name" or "age")
        const replacement = values[key] !== undefined ? values[key] : match[0]; // Get the value or keep the placeholder

        result = result.replace(match[0], replacement); // Replace the placeholder
    }

    return result;
}

export default formatTemplate;
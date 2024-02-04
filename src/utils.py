
def summarize_prompt(prompt, client):
    completion = client.chat.completions.create(
    model="gpt-3.5-turbo-0125",
    messages=[
            {"role": "system", "content": "You are an informative professor explaining the concept to a student in 40 or less words."},
            {"role": "user", "content": prompt}
        ]
    )

    sum = completion.choices[0].message.content

    return sum

def get_category(sum, client):
    categories = ["education", "casual", "restaurant"]
    cats = ""

    for i in categories:
        cats += i + ", "

    summarize = f"Summary: {sum}, current categories: {cats}"

    final = client.chat.completions.create(
    model="gpt-3.5-turbo-0125",
    messages=[
            {"role": "system", "content": "Categorize the summary; if any match, say the category. If it is a new category, say the new category (1 word)"},
            {"role": "user", "content": summarize}
        ]
    )

    return f"Category: {final.choices[0].message.content}"

def get_image(description, client):
    response = client.images.generate(
    model="dall-e-2",
    prompt="colorful cartoon icon with a minimalist background color using the following description: " + description,
    n=1,
    response_format="url",
    size="256x256"
    )

    print(description)
    print("!!!!!")
    print(response)
    print("!!!!!")

    return response.data[0].url

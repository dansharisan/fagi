export async function GET(request: Request) {
    // TODO: Implement a middleware to only allow IP of the current site

    try {
        const apiResponse = await fetch(
            "https://production.dataviz.cnn.io/index/fearandgreed/graphdata",
            {
                method: "GET",
                headers: {
                    // Need to set User-Agent to mimic a normal browser otherwise CNN will think this is a bot and won't provide the data
                    "User-Agent":
                        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
                },
            }
        );

        const data = await apiResponse.json();

        return new Response(JSON.stringify(data), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error: any) {
        return new Response(
            JSON.stringify({
                message: error.message,
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
    }
}

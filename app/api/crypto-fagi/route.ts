export const revalidate = 0;

export async function GET(request: Request) {
    // TODO: Implement a middleware to only allow IP of the current site

    try {
        const apiResponse = await fetch(
            "https://www.bitdegree.org/api/fear-and-greed-index-chart?period=1y",
            {
                method: "GET",
                headers: {
                    Host: "www.bitdegree.org",
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

export const revalidate = 0;

const { query } = require("@/lib/db");
const { NextResponse } = require("next/server");

// GET: Check if the article is liked by the user
export async function GET(req, { params }) {
    try {
        const url = new URL(req.url);
        const userId = url.searchParams.get("userId");
        const articleId = parseInt(params.id, 10);

        console.log("GET - userId:", userId, "articleId:", articleId); // Debugging

        if (!userId || isNaN(articleId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID or article ID" },
                { status: 400 }
            );
        }

        const result = await query(
            "SELECT EXISTS (SELECT 1 FROM article_likes WHERE user_id = $1 AND article_id = $2) AS is_liked",
            [userId, articleId]
        );

        return NextResponse.json({
            success: true,
            message: "Like status fetched successfully",
            data: { isLiked: result.rows[0].is_liked },
        });
    } catch (error) {
        console.error("Error fetching like status:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// POST: Like an article
export async function POST(req, { params }) {
    let userId;
    try {
        const body = await req.json();
        userId = body.userId;
    } catch (e) {
        console.error("Error parsing request body:", e);
        return NextResponse.json(
            { success: false, message: "Invalid request body" },
            { status: 400 }
        );
    }

    const articleId = parseInt(params.id, 10);

    console.log("POST - userId:", userId, "articleId:", articleId); // Debugging

    try {
        if (!userId || isNaN(articleId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID or article ID" },
                { status: 400 }
            );
        }

        await query("BEGIN");
        const existingLike = await query(
            "SELECT * FROM article_likes WHERE user_id = $1 AND article_id = $2",
            [userId, articleId]
        );

        if (existingLike.rows.length > 0) {
            await query("ROLLBACK");
            return NextResponse.json(
                { success: false, message: "Article already liked" },
                { status: 400 }
            );
        }

        await query(
            "INSERT INTO article_likes (user_id, article_id) VALUES ($1, $2)",
            [userId, articleId]
        );
        await query("COMMIT");

        return NextResponse.json({
            success: true,
            message: "Article liked successfully",
        });
    } catch (error) {
        await query("ROLLBACK");
        console.error("Error liking article:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

// DELETE: Unlike an article
export async function DELETE(req, { params }) {
    let userId;
    try {
        const body = await req.json();
        userId = body.userId;
    } catch (e) {
        console.error("Error parsing request body:", e);
        return NextResponse.json(
            { success: false, message: "Invalid request body" },
            { status: 400 }
        );
    }

    const articleId = parseInt(params.id, 10);

    console.log("DELETE - userId:", userId, "articleId:", articleId); // Debugging

    try {
        if (!userId || isNaN(articleId)) {
            return NextResponse.json(
                { success: false, message: "Invalid user ID or article ID" },
                { status: 400 }
            );
        }

        await query("BEGIN");
        const result = await query(
            "DELETE FROM article_likes WHERE user_id = $1 AND article_id = $2 RETURNING *",
            [userId, articleId]
        );

        if (result.rows.length === 0) {
            await query("ROLLBACK");
            return NextResponse.json(
                { success: false, message: "Like not found" },
                { status: 404 }
            );
        }

        await query("COMMIT");

        return NextResponse.json({
            success: true,
            message: "Article unliked successfully",
        });
    } catch (error) {
        await query("ROLLBACK");
        console.error("Error unliking article:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}

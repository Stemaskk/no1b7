// Building 7 — redirect, no popup

document.addEventListener("DOMContentLoaded", () => {
    // ---------- helpers ----------
    function collectForm(formEl) {
        const data = {};
        const fd = new FormData(formEl);
        for (const [name, value] of fd.entries()) {
            if (data[name]) {
                if (Array.isArray(data[name])) data[name].push(value);
                else data[name] = [data[name], value];
            } else {
                data[name] = value;
            }
        }
        // include unchecked checkbox groups as empty arrays
        formEl.querySelectorAll('input[type="checkbox"]').forEach(cb => {
            if (!fd.has(cb.name)) data[cb.name] = [];
        });
        return data;
    }

    function sameSet(a = [], b = []) {
        const A = [...a].sort();
        const B = [...b].sort();
        return JSON.stringify(A) === JSON.stringify(B);
    }

    // Normalize string: remove spaces/punctuation, lowercase
    function normalize(s) {
        return (s || "")
            .toLowerCase()
            .replace(/[\s\.\-_,’'"]/g, "");
    }

    // ---------- answer key (same as yours) ----------
    const correct = {
        "b7-floor3": "Counseling Center",
        // "EOPS Care Calworks" (case/space-insensitive)
        "b7-eops": "eopscarecalworks",
        "b7-gallery": "Skeleton",
        "b7-finance": "Floor 2",
        // trustees accepted (normalized)
        "b7-trustees": [
            "suzanneleechan",
            "bettyho",
            "drrichardwatters",
            "richardwatters",
            "rakishsharma",
            "drrakishsharma",
            "elisamartinez",
            "gregorybonaccorsi",
            "lancekwan"
        ]
    };

    // ---------- redirect ----------
    const REDIRECT_URL = "https://lilttleponds.netlify.app/";

    // ---------- checker ----------
    function allAnswersCorrect(ans) {
        const q1 = (ans["b7-floor3"] || "") === correct["b7-floor3"];
        const q2 = normalize(ans["b7-eops"]) === correct["b7-eops"];
        const q3 = (ans["b7-gallery"] || "") === correct["b7-gallery"];
        const q4 = (ans["b7-finance"] || "") === correct["b7-finance"];

        const trusteeNorm = normalize(ans["b7-trustee"]);
        const q5 = correct["b7-trustees"].includes(trusteeNorm);

        return q1 && q2 && q3 && q4 && q5;
    }

    // ---------- wire up ----------
    const form = document.getElementById("quiz-form");
    const results = document.getElementById("results");
    const resetAll = document.getElementById("resetAll");

    if (!form || !results) {
        console.error("quiz-form or results not found. Check your HTML ids.");
        return;
    }

    form.setAttribute("action", "javascript:void(0)");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const ok = allAnswersCorrect(collectForm(form));
        if (ok) {
            results.textContent = "All correct! Redirecting…";
            setTimeout(() => { window.location.href = REDIRECT_URL; }, 50);
        } else {
            results.textContent = "Not quite — try again.";
        }
        results.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });

    if (resetAll) {
        resetAll.addEventListener("click", () => {
            form.reset();
            results.textContent = "";
        });
    }
});

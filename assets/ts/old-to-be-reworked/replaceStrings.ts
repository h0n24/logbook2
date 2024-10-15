// TODO: between dates -> in .beetwen_nav there is - instead of –⁠ (pomlčka)

const replacements = [] as [string, string][];

// nenalezeno v lokalizačním systému
replacements.push(["№", "č. "]);
replacements.push(["ч.", " hod "]);
replacements.push(["мин.", " min"]);
replacements.push(["лет", "let"]);

replacements.push(["UI/UX-TH-11 -23", "UI/UX-TH-11-23"]); // can be removed after year 2025

// custom náhrady ----------
replacements.push(["Označte online", "Online"]);
// replacements.push(["Označit přítomnost", "Přítomen?"]);
replacements.push(["Označit přítomnost", "Na hodině?"]);

replacements.push(["Naposledy v MyStatu :", "Naposledy v MyStatu"]); // není jisté, zda půjde

replacements.push(["Prezentácia projektu", "Prezentace projektu"]);

// chyby v lokalizaci ----------
// může být změněno v lokalizačním systému:
replacements.push(["krystaly odstraněny", "Diamanty odebrány"]);
// replacements.push(["V skupine  není studentů", "Ve skupině nejsou studenti"]);
replacements.push([
  "V skupine  není studentů",
  "Dnes na této pobočce neučíte žádné studenty.",
]);
replacements.push([
  "cover_img_rules",
  "Velikost souboru musí být maximálně 100 MB.",
]);
replacements.push(["upload_cover", "Nahrát titulní obrázek"]);
replacements.push(["Složka", "Vybrat soubor"]);
replacements.push(["Udělte známku:", "Udělte známku"]);

// nemůže být změněno v lokalizačním systému
replacements.push(["Docházka, %", "Docházka"]); // proč? chyběli by % (css)
replacements.push(["přidat materiál", "přidat DÚ, materiál"]); // proč? není jasné jestli se používá jen v presence

// chybí v lokalizaci
replacements.push([
  "delete_hw_subtitle",
  "Odstraňujete-li DÚ, přidejte komentář proč nebo připojte soubor.",
]);
replacements.push([
  "delete_hw_comment",
  "Popište žákovi, proč úkol odstraňujete.",
]);
replacements.push(["delete_hw_choose_file", "Vyberte soubor"]);
replacements.push(["delete_hw_cancel_btn", "Zrušit"]);
replacements.push(["delete_hw_delete_btn", "Odstranit DÚ"]);

// more effective replacement for strings
function replaceWithTreeWalker() {
  let allTextNodes = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT
    ),
    // some temp references for performance
    tmptxt,
    tmpnode;

  // iterate through all text nodes
  while (allTextNodes.nextNode()) {
    tmpnode = allTextNodes.currentNode;
    tmptxt = tmpnode.nodeValue;

    for (let i = 0; i < replacements.length; i++) {
      tmptxt = tmptxt.replace(replacements[i][0], replacements[i][1]);
    }
    tmpnode.nodeValue = tmptxt;
  }
}

export function replaceStrings() {
  const debug = false;

  try {
    debug ? console.time("replaceStrings") : null;
    replaceWithTreeWalker();
    debug ? console.timeEnd("replaceStrings") : null;
  } catch (error) {}
}

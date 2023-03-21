process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
const REVALIDATE_KEY = process.env.REVALIDATE_KEY;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

// funzione di revalidate di una singola pagina
const revalidateSinglePage = async (url, path) => {
  const data = await fetch("https:\\" + url + "/api/revalidate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: REVALIDATE_KEY,
      urlPath: "/_sites/" + url + path,
    }),
  });
  let json = await data.json();
  return json;
};

// revalidate tutte le pagine di un sito
const revalidateWebsite = async (websiteId) => {
  try {
    const entry = await strapi.entityService.findOne(
      "api::sito.sito",
      websiteId,
      {
        populate: { pagines: "*" },
      }
    );

    const siteId = entry?.id;
    if (siteId) {
      const { pubblicato, url_provvisorio, url, pagines } = entry;
      let allresults = [];
      const promises = pagines.map((page) => {
        const pageSlug = page.slug;
        return revalidateSinglePage(
          url_provvisorio,
          pageSlug === "/" ? "" : "/" + pageSlug
        );
      });
      const result = await Promise.all(promises);
      allresults = [...allresults, ...result];
      if (pubblicato) {
        const promises = pagines.map((page) => {
          const pageSlug = page.slug;
          return revalidateSinglePage(
            url,
            pageSlug === "/" ? "" : "/" + pageSlug
          );
        });
        const result2 = await Promise.all(promises);
        allresults = [...allresults, ...result2];
      }

      return allresults;
    }
    return [];
  } catch (e) {
    return [];
  }
};

module.exports = {
  afterCreate(event) {
    try {
      const ctx = strapi.requestContext.get();
      const user = ctx?.state?.user ?? null;
      const { result, params, model } = event;
      const entity = model?.tableName;
      const entityId = result?.id ?? null;
      strapi.entityService.create("api::app-log.app-log", {
        data: {
          type: "create",
          payload: params,
          entity: entity,
          utente: user,
          entityId: entityId,
        },
      });
      let revalidated = null;
      if (entity === "oraris") {
        const siteId = params?.data?.sito;
        revalidatedId = siteId;
        if (siteId) {
          revalidated = revalidateWebsite(siteId);
        }
      }
    } catch (e) {
      console.log(e);
    }
  },
  afterUpdate(event) {
    try {
      const ctx = strapi.requestContext.get();
      const user = ctx?.state?.user ?? null;
      const { result, params, model } = event;
      const entity = model?.tableName;
      const entityId = result?.id ?? null;
      // se è stato aggiornato un sito faccio l'update di tutte le pagine
      let revalidated = null;
      let revalidatedId = entityId;
      console.log(entity);
      if (entity === "sitis") {
        try {
          revalidated = revalidateWebsite(entityId);
        } catch (e) {
          console.log(e);
        }
      } else if (entity === "pagine") {
        const siteId = params?.data?.sito;
        revalidatedId = siteId;
        if (siteId) {
          revalidated = revalidateWebsite(siteId);
        }
      } else if (entity === "oraris") {
        const siteId = params?.data?.sito;
        revalidatedId = siteId;
        if (siteId) {
          revalidated = revalidateWebsite(siteId);
        }
      } else if (entity === "blog_posts") {
        const siteId = params?.data?.sito;
        revalidatedId = siteId;
        if (siteId) {
          revalidated = revalidateWebsite(siteId);
        }
      } else if (entity === "anagrafica_sitos") {
        const siteId = params?.data?.sito;
        revalidatedId = siteId;
        if (siteId) {
          revalidated = revalidateWebsite(siteId);
        }
      }
      if (revalidated) {
        strapi.entityService.create("api::app-log.app-log", {
          data: {
            type: "revalidate",
            payload: revalidated,
            entity: "sitis",
            entityId: revalidatedId,
            utente: user,
          },
        });
      }
      strapi.entityService.create("api::app-log.app-log", {
        data: {
          type: "update",
          payload: params,
          entity: entity,
          entityId: entityId,
          utente: user,
        },
      });
      const date = new Date();
      strapi.db.query("api::app-log.app-log").deleteMany({
        where: {
          createdAt: {
            $lt: new Date(date.setMonth(date.getMonth() - 3)),
          },
        },
      });
    } catch (e) {
      console.log(e);
    }
    //console.log(result, params);
  },
};

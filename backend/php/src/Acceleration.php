<?php

namespace Acceleration;

use Acceleration\Exceptions\BaseViewInvalid;
use Acceleration\Exceptions\BaseViewNotFound;
use Acceleration\Exceptions\BaseViewUrlNotSet;
use Acceleration\Exceptions\CouldNotSetBaseView;
use DOMDocument;

class Acceleration
{

    /**
     * This function accepts an link to the base html view (important: The base HTML view has to have a div with the id "main")
     * 
     * @param string $url
     * 
     * @throws BaseViewNotFound
     * @throws BaseViewInvalid
     * @throws CouldNotSetBaseView
     * 
     * @return void
     */
    public static function setBaseView(string $url): void
    {

        //try to load the html
        $html = file_get_contents($url);
        if ($html === false) throw new BaseViewNotFound($url);

        //check if the html contains a div with the "main" id
        $dom = new DOMDocument();
        $dom->loadHTML($html);

        $main = $dom->getElementById("main");
        if (is_null($main) || $main->tagName !== "div") throw new BaseViewInvalid();

        $ret = putenv("ACCELERATION_BASE_VIEW=\"$url\"");
        if ($ret === false) throw new CouldNotSetBaseView();
    }

    /**
     * This function either returns a simple page object as array or a full html page as string
     * 
     * @param string $page_name
     * @param array<string,mixed> $props
     * 
     * @throws BaseViewUrlNotSet
     * @throws BaseViewNotFound
     * @throws BaseViewInvalid
     * 
     * @return string|array<string,mixed>
     */
    public static function render(string $page_name, array $props): string|array
    {

        $page_object = [
            "page" => $page_name,
            "props" => $props,
            "url" => $_SERVER['REQUEST_URI']
        ];


        //check header
        $acceleration_initialised = $_SERVER['HTTP_X-Acceleration'];

        //if acceleration is initialised simply return a page JSON ojbect
        if ($acceleration_initialised) {
            return $page_object;
        }

        //otherwhise get the baseview
        $baseview_url = getenv("ACCELERATION_BASE_VIEW");
        if ($baseview_url === false) throw new BaseViewUrlNotSet();

        $html = file_get_contents($baseview_url);
        if ($html === false) throw new BaseViewNotFound($baseview_url);

        //check if the html contains a div with the "main" id
        $dom = new DOMDocument();
        $dom->loadHTML($html);

        $main = $dom->getElementById("main");
        if (is_null($main) || $main->tagName !== "div") throw new BaseViewInvalid();

        $main->setAttribute("x-page",json_encode($page_object));

        return $dom->saveHTML();
    }
}
